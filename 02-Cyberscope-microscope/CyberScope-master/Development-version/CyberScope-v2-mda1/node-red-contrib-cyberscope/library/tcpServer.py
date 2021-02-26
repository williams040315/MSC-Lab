#!/usr/bin/env python
"""
A TCP communication class that acts as the server side for generic communications
between programs
"""

import sys
from PyQt5 import QtCore, QtGui, QtWidgets, QtNetwork

from library.tcpMessage import TCPMessage
import library.tcpCommunications as tcpCommunications


class TCPServer(QtNetwork.QTcpServer, tcpCommunications.TCPCommunicationsMixin):
    """
    A TCP server for passing TCP messages between programs.
    """
    comGotConnection = QtCore.pyqtSignal()
    comLostConnection = QtCore.pyqtSignal()
    messageReceived = QtCore.pyqtSignal(object)
    
    def __init__(self, **kwds):
        super().__init__(**kwds)

        # Connect new connection signal
        self.newConnection.connect(self.handleClientConnection)
        
        # Listen for new connections
        self.connectToNewClients()

    def connectToNewClients(self):
        """
        Listen for new clients.
        """
        if self.verbose:
            string = "Listening for new clients at: \n"
            string += "    Address: " + self.address.toString() + "\n"
            string += "    Port: " + str(self.port)
            print(string)
        self.listen(self.address, self.port)
        self.comGotConnection.emit()
 
    def disconnectFromClients(self):
        """
        Disconnect from clients.
        """
        if self.verbose:
            print("Force disconnect from clients")
        if self.isConnected():
            self.socket.disconnectFromHost()
            self.socket.waitForDisconnect()
            self.socket.close()
            self.socket = None
            self.comLostConnection.emit()
            self.connectToNewClients()
    
    def handleClientConnection(self):
        """
        Handle connection from a new client.
        """
        socket = self.nextPendingConnection()

        if not self.isConnected():
            self.socket = socket
            self.socket.readyRead.connect(self.handleReadyRead)
            self.socket.disconnected.connect(self.handleClientDisconnect)
            self.comGotConnection.emit()
            if self.verbose:
                print("Connected new client")
        else: # Refuse new socket if one already exists
            message = TCPMessage(message_type = "Busy") # from tcpMessage.TCPMessage
            if self.verbose:
                print("Sent: \n" + str(message))
            socket.write(bytes(message.toJSON() + "\n", "utf-8"))
            socket.disconnectFromHost()
            socket.close()

    def handleClientDisconnect(self):
        """
        Handle disconnection of client.
        """
        self.socket.disconnectFromHost()
        self.socket.close()
        self.socket = None
        self.comLostConnection.emit()
        if self.verbose:
            print("Client disconnected")
            
        
class StandAlone(QtWidgets.QMainWindow):
    """
    Stand alone test class.
    """
    def __init__(self, **kwds):
        super().__init__(**kwds)

        # Create server
        self.server = TCPServer(port = 9500, verbose = True)

        # Connect PyQt signals
        self.server.comGotConnection.connect(self.handleNewConnection)
        self.server.comLostConnection.connect(self.handleLostConnection)
        self.server.messageReceived.connect(self.handleMessageReceived)

    def handleNewConnection(self):
        """
        Handle new connection.
        """
        print("Established connection")

    def handleLostConnection(self):
        """
        Handle lost connection.
        """
        print("Lost connection")

    def handleMessageReceived(self, message):
        """
        Handle new message.
        """
        # Parse Based on Message Type
        if (message.getType() == "Stage Position"):
            print("Stage X: ", message.getData("Stage_X"), "Stage Y: ", message.getData("Stage_Y"))
            self.server.sendMessage(message)
            
        elif (message.getType() == "Movie"):
            print("Movie: ", "Name: ", message.getData("Name"), "Parameters: ", message.getData("Parameters"))
            self.server.sendMessage(message)

    def closeEvent(self, event):
        """
        Handle close event.
        """
        self.server.close()
        self.close()


# 
# Test/Demo of Class
#                        
if (__name__ == "__main__"):
    app = QtWidgets.QApplication(sys.argv)
    window = StandAlone()
    window.show()
    sys.exit(app.exec_())
