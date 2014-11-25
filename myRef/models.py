from django.db import models

# Create your models here.
class RefFile(models.Model):
    filename = models.CharField(max_length=200)
    pubYear = models.CharField(max_length=10)    
    posX = models.CharField(max_length=10)
    posY = models.CharField(max_length=10)

    def __str__(self):
        return self.filename+'#'+self.pubYear+'#'+self.posX+'#'+self.posY
