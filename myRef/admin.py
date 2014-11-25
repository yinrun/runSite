from django.contrib import admin
from myRef.models import RefFile
# Register your models here.
'''
class RefFileAdmin(admin.ModelAdmin):
    fields=['FileName','Publicate Year','X','Y']
    '''

class RefFileAdmin(admin.ModelAdmin):
    #none means nothing
    fieldsets =[('FileProperty',{'fields':['filename','pubYear']}),
                ('Position',{'fields':['posX','posY'],'classes':['collapse']}),]
admin.site.register(RefFile,RefFileAdmin)
