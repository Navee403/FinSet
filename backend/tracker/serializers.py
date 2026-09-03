# pyrefly: ignore [missing-import]
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Income, Expense, UserProfile, Budget, Debt

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('preferred_currency',)

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if 'username' not in validated_data:
            validated_data['username'] = validated_data.get('email')
        user = User.objects.create_user(**validated_data)
        return user

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ('id', 'user', 'source', 'amount', 'date', 'is_recurring')
        read_only_fields = ('user',)

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('id', 'user', 'category', 'description', 'amount', 'date', 'is_recurring')
        read_only_fields = ('user',)

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('id', 'user', 'category', 'amount', 'month')
        read_only_fields = ('user',)

class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = ('id', 'user', 'person_name', 'type', 'amount', 'date', 'is_settled')
        read_only_fields = ('user',)
