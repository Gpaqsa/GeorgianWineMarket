from rest_framework import serializers
from .models import Order, Region, GrapeVariety, Wine, OrderItem
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class GrapeVarietySerializer(serializers.ModelSerializer):
    class Meta:
        model = GrapeVariety
        fields = '__all__'

class WineSerializer(serializers.ModelSerializer):
    # იმისთვის, რომ React-ში მარტო ID-ები კი არ მოვიდეს, არამედ რეგიონის და ჯიშის სახელებიც:
    region_details = RegionSerializer(source='region', read_only=True)
    grape_variety_details = GrapeVarietySerializer(source='grape_variety', read_only=True)

    class Meta:
        model = Wine
        fields = [
            'id', 'title', 'description', 'price', 'color', 
            'region', 'region_details', 'grape_variety', 'grape_variety_details', 
            'image', 'created_at'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # ტოკენის Payload-ში ვამატებთ მომხმარებლის სახელს
        token['username'] = user.username
        return token
    
class OrderItemHistorySerializer(serializers.ModelSerializer):
    wine_title = serializers.ReadOnlyField(source='wine.title') # პირდაპირ სახელი რომ წამოვიღოთ

    class Meta:
        model = OrderItem
        fields = ['id', 'wine_title', 'quantity', 'price']

class OrderHistorySerializer(serializers.ModelSerializer):
    items = OrderItemHistorySerializer(many=True, read_only=True) # შეკვეთის პროდუქტები
    status_display = serializers.CharField(source='get_status_display', read_only=True) # ქართული სტატუსი

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'total_price', 'status', 'status_display', 'items']