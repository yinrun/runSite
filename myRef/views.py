from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext,loader

from myRef.models import RefFile
# Create your views here.
def index(request):
    latest_list = RefFile.objects.all()
    template = loader.get_template('myRef/abc.html')
    context = RequestContext(request,{'latest_list':latest_list,})
    return HttpResponse(template.render(context))

