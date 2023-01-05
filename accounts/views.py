from django.shortcuts import render, redirect
from .models import User
from .forms import CustomUserCreationForm
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout

# Create your views here.
def index(request):
    users = User.objects.all()
    context = {
        'users': users,
    }
    return render(request, 'accounts/index.html', context)

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)
            return redirect("accounts:login")
    else:
        form = CustomUserCreationForm()
    context = {
        'form': form,
        }
    return render(request, 'accounts/signup.html', context)

def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            auth_login(request, form.get_user())
            return redirect(request.GET.get('next') or 'main:main')
    else:
        form = AuthenticationForm()
    context = {
        'form': form,
    }
    return render(request, 'accounts/login.html', context)

def logout(request):
    return render(request, 'accounts/logout.html')

def profile(request, pk):
    return render(request, 'accounts/profile.html')

def location(request):
    if request.method == 'POST':
        place = request.POST.get('place', '')
        user = request.user
        user.location = place
        user.save()
    location = request.user.location
    context = {
        'location': location,
    }
    return render(request, 'accounts/location.html', context)
