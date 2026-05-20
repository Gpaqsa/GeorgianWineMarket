from django.urls import path, include
from rest_framework.routers import DefaultRouter

from wines.serializers import MyTokenObtainPairSerializer
from .views import RegionViewSet, GrapeVarietyViewSet, WineViewSet, create_order, user_orders, wine_detail
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from wines.views import register_user  # დარწმუნდი რომ სწორი იმპორტია


router = DefaultRouter()
router.register(r'wines', WineViewSet, basename='wine')
router.register(r'regions', RegionViewSet, basename='region')
router.register(r'varieties', GrapeVarietyViewSet, basename='variety')

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    

urlpatterns = [
    path('', include(router.urls)),

    path('auth/register/', register_user, name='register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('orders/', create_order, name='create_order'),
    path('wines/<int:pk>/', wine_detail, name='wine_detail'),
    path('orders/my/', user_orders, name='user_orders'),
]