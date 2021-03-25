import os
import time
'''
[manip@Alfred avocat_deuxvues_5mai2017]$ gphoto2 --auto-detect
ModÃ¨le                        Port                                             
----------------------------------------------------------
Nikon DSC D3300                usb:005,004     
Nikon DSC D3300                usb:005,003     
Nikon DSC D3300                usb:005,002    
'''



repertoire = ''#'/mnt/data/manips/Baptiste/test2Nut-18-01-18'  # sans slash a la fin
dt = '300' #en seconde
N = '-1' # -1 is infinite

#cmd = 'gphoto2 --auto-detect > ports.txt'
#os.system(cmd)
##~ listeusb=['007,009','007,006','007,007','007,008','005,011','005,010','005,009','005,008']
#f = open('ports.txt','r')
#lignes = f.readlines()
listeusb = ['005,002']
#for l in lignes[2:]:
	#p = l.split(':')[1].strip()
	#listeusb.append(p)
#print listeusb
#f.close()


for usb in listeusb:
	cmdforever='gphoto2 --port usb:'+usb+' --capture-image-and-download -I '+dt+' -F '+N+' --filename "'+repertoire+'/'+usb+'/'+'img_'+usb+'_%y%m%d-%H%M%S.jpg" &'
	print(cmdforever)
	#os.system(cmdforever)
	time.sleep(1)

