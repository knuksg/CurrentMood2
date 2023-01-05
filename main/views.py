from django.shortcuts import render

# Create your views here.
def main(request):

    return render(request, 'main/main.html')

def search(request):
    search_input = None
    if request.method == 'POST':
        search_input = request.POST.get('search-input', '')
    context = {
        'search_input': search_input
    }
    return render(request, 'main/search.html', context)