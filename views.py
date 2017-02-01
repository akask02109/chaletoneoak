
from django.views.generic.base import TemplateView


class HomeView(TemplateView):
    template_name = 'home.html'

class GalleryView(TemplateView):
    template_name = 'gallery.html'
