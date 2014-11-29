from django.conf.urls import patterns,url
from myRef import views

urlpatterns = patterns('',url(r'^$',views.index,name='index'),url(r'mytest',views.mytest,name='mytest'),url(r'myBrowser',views.myBrowser,name='myBrowser'))
