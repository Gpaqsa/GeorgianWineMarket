from rest_framework import viewsets
from .models import Region, GrapeVariety, Wine, Order, OrderItem
from .serializers import OrderHistorySerializer, RegionSerializer, GrapeVarietySerializer, WineSerializer
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer  # <-- ამ ხაზით აკავშირებ ფაილებს ერთმანეთთან
from .serializers import WineSerializer # ჩასვი შენი სერიალაიზერის სახელი

from rest_framework.permissions import IsAuthenticated



class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class GrapeVarietyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GrapeVariety.objects.all()
    serializer_class = GrapeVarietySerializer

class WineViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WineSerializer

    def get_queryset(self):
        queryset = Wine.objects.all().select_related('region', 'grape_variety')
        
        # URL-დან ფილტრების წამოღება (მაგალითად: /api/wines/?color=RED&region=1)
        color = self.request.query_params.get('color')
        region_id = self.request.query_params.get('region')
        variety_id = self.request.query_params.get('variety')

        if color:
            queryset = queryset.filter(color=color)
        if region_id:
            queryset = queryset.filter(region_id=region_id)
        if variety_id:
            queryset = queryset.filter(grape_variety_id=variety_id)
            
        return queryset
    


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "მომხმარებელი წარმატებით დარეგისტრირდა!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    data = request.data
    cart_items = data.get('cartItems', [])

    if not cart_items:
        return Response({"detail": "კალათა ცარიელია"}, status=status.HTTP_400_BAD_REQUEST)

    total_price = data.get('totalPrice', 0)
    order = Order.objects.create(user=user, total_price=total_price)

    for item in cart_items:
        try:
            wine = Wine.objects.get(id=item['id'])
            OrderItem.objects.create(
                order=order,
                wine=wine,
                quantity=item['quantity'],
                price=item['price']
            )
        except Wine.DoesNotExist:
            return Response({"detail": f"ღვინო ID-ით {item['id']} ვერ მოიძებნა"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "შეკვეთა წარმატებით დარეგისტრირდა!", "order_id": order.id}, status=status.HTTP_201_CREATED)



@api_view(['GET'])
@permission_classes([AllowAny]) # ყველას შეუძლია ნახვა
def wine_detail(request, pk):
    try:
        wine = Wine.objects.get(pk=pk)
        serializer = WineSerializer(wine, context={'request': request})
        return Response(serializer.data)
    except Wine.DoesNotExist:
        return Response({"detail": "ღვინო ვერ მოიძებნა"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # მხოლოდ სისტემაში შესულებისთვის
def user_orders(request):
    # ფილტრაცია ხდება კონკრეტულად იმ იუზერით, ვინც რექვესტს აგზავნის
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderHistorySerializer(orders, many=True)
    return Response(serializer.data)