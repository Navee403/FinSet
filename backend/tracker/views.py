from rest_framework import generics, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Sum
from django.db.models.functions import TruncMonth, TruncDay
from .models import Income, Expense, UserProfile, Budget, Debt
from .serializers import UserSerializer, IncomeSerializer, ExpenseSerializer, UserProfileSerializer, BudgetSerializer, DebtSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.profile
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=400)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).order_by('-month')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DebtViewSet(viewsets.ModelViewSet):
    serializer_class = DebtSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Debt.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DashboardDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        incomes = Income.objects.filter(user=request.user)
        expenses = Expense.objects.filter(user=request.user)
        
        # Total Income & Expense
        total_income = incomes.aggregate(total=Sum('amount'))['total'] or 0
        total_expense = expenses.aggregate(total=Sum('amount'))['total'] or 0
        
        # Calculate unsettled debts for balance adjustments
        unsettled_lent = Debt.objects.filter(user=request.user, type='lent', is_settled=False).aggregate(total=Sum('amount'))['total'] or 0
        unsettled_borrowed = Debt.objects.filter(user=request.user, type='borrowed', is_settled=False).aggregate(total=Sum('amount'))['total'] or 0
        
        # Balance = Income - Expenses - Lent (money left my pocket) + Borrowed (money entered my pocket)
        balance = total_income - total_expense - unsettled_lent + unsettled_borrowed

        # Expenses by category (for pie chart)
        expenses_by_category = list(expenses.values('category').annotate(amount=Sum('amount')).order_by('-amount'))

        # Expenses by day (for line/bar chart over time)
        expenses_by_day = list(expenses.annotate(day=TruncDay('date'))
                                     .values('day')
                                     .annotate(amount=Sum('amount'))
                                     .order_by('day'))

        # Format dates for frontend
        for item in expenses_by_day:
            item['day'] = item['day'].strftime('%Y-%m-%d') if item['day'] else None

        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': balance,
            'expenses_by_category': expenses_by_category,
            'expenses_by_day': expenses_by_day
        })
