# -*- coding: utf-8 -*-
"""
Created on Wed Feb 24 10:24:51 2021
@author: Williams BRETT, MSC, CNRS
"""

'''Import'''
from websocket import create_connection
import datetime as dt
import matplotlib.pyplot as plt
import matplotlib.animation as animation

'''Tunnel de communication avec NR'''
magnitude = create_connection("ws://127.0.0.1:1880/magnitude")
phase = create_connection("ws://127.0.0.1:1880/phase")
sensibility = create_connection("ws://127.0.0.1:1880/sensibility")

'''Création de la figure pour l'affichage''' 
fig = plt.figure()
ax1 = fig.add_subplot(2, 1, 1)
ax2 = fig.add_subplot(2, 1, 2)
xs = [] ; ys = []
#serie y a deux colonnes, pour M et P
for i in range(0,2):
    ys.append([])


'''Fonction d'animation, programme 2, juste un affichage de M et P dans matplotLib'''
# Cette fonction est appelé périodiquement par FuncAnimation
def animate(i, xs, ys):
    
    #40 items max soit 200ms x 40 = 8s
    limItem = -40 

    # Ajout de x et y dans les listes
    #xs.append(dt.datetime.now().strftime('%H:%M:%S.%f'))
    xs.append(i) ; ys[0].append(float(magnitude.recv())) ; ys[1].append(float(phase.recv()))
    
    # Limitation a 20 items
    xs = xs[limItem:] ; ys[0] = ys[0][limItem:] ; ys[1] = ys[1][limItem:]
    
    # Mise a jour
    ax1.clear() ; ax1.plot(xs, ys[0], 'r')
    ax2.clear() ; ax2.plot(xs, ys[1], 'b')

    # Format
    ax1.set_title('Magnitude') ; ax1.set_xlabel('Iterator (x 200ms)') ; ax1.set_ylabel('Value')
    ax2.set_title('Phase') ; ax2.set_xlabel('Iterator (x 200ms)') ; ax2.set_ylabel('Value')
    plt.subplots_adjust(hspace=0.6)
    
# Réglage du plot et appel de la function d'animation periodiquement
ani = animation.FuncAnimation(fig, animate, fargs=(xs, ys), interval=200)
plt.show()

print('<Fin> :-)')
