from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    preferred_currency = models.CharField(max_length=10, default='USD')
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incomes')
    source = models.CharField(max_length=255, help_text="e.g. Monthly Salary, Freelance")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    is_recurring = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.source}: {self.amount}"

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('housing', 'Housing & Rent'),
        ('food', 'Food & Groceries'),
        ('transport', 'Transportation'),
        ('utilities', 'Utilities'),
        ('entertainment', 'Entertainment'),
        ('shopping', 'Shopping'),
        ('health', 'Health & Fitness'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    is_recurring = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.category}: {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=30, choices=Expense.CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.DateField(help_text="Set to the first day of the month")

    class Meta:
        unique_together = ('user', 'category', 'month')

    def __str__(self):
        return f"{self.user.username} - {self.category} Budget: {self.amount}"

class Debt(models.Model):
    DEBT_TYPES = (
        ('lent', 'I Lent (Owed to me)'),
        ('borrowed', 'I Borrowed (I owe)'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='debts')
    person_name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=DEBT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    is_settled = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.type} {self.amount} with {self.person_name}"
