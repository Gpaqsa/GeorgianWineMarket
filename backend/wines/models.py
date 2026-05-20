from django.db import models
from django.contrib.auth.models import User

class Region(models.Model):
    name = models.CharField(max_length=100, verbose_name="რეგიონი")

    def __str__(self):
        return self.name

class GrapeVariety(models.Model):
    name = models.CharField(max_length=100, verbose_name="ყურძნის ჯიში")

    def __str__(self):
        return self.name

class Wine(models.Model):
    COLOR_CHOICES = [
        ('RED', 'წითელი'),
        ('WHITE', 'თეთრი'),
        ('ROSE', 'ვარდისფერი'),
        ('AMBER', 'ქარვისფერი/ქვევრის'),
    ]

    title = models.CharField(max_length=200, verbose_name="სახელწოდება")
    description = models.TextField(verbose_name="აღწერა")
    price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="ფასი")
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, verbose_name="ფერი")
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="wines", verbose_name="რეგიონი")
    grape_variety = models.ForeignKey(GrapeVariety, on_delete=models.CASCADE, related_name="wines", verbose_name="ჯიში")
    image = models.ImageField(upload_to='wines/', blank=True, null=True, verbose_name="სურათი")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'მოდინე'),
        ('COMPLETED', 'დასრულებული'),
        ('CANCELLED', 'გაუქმებული'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING') # 👈 აი აქ გასწორდა max_length-ზე!

    def __str__(self):
        return f"შეკვეთა #{self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    wine = models.ForeignKey(Wine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.wine.title} (შეკვეთა #{self.order.id})"