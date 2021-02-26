#!/usr/bin/env python
"""
A TCP communication class that acts as the client side for generic communications
between programs
"""

# 
# Import
# 
import sys
import time
from PyQt5 import QtCore, QtGui, QtNetwork, QtWidgets

from library.tcpMessage import TCPMessage
import library.tcpCommunications as tcpCommunications


class TCPClient(QtCore.QObject, tcpCommunications.TCPCommunicationsMixin):
    """
    A TCP client class used to transfer TCP messages from one program to another
    """
    comLostConnection = QtCore.pyqtSignal()
    messageReceived = QtCore.pyqtSignal(object)

    def __init__(self, **kwds):
        super().__init__(**kwds)
        
        # Create instance of TCP socket
        self.socket = QtNetwork.QTcpSocket()
        self.socket.disconnected.connect(self.handleDisconnect)
        self.socket.readyRead.connect(self.handleReadyRead)

    def connectToServer(self):
        """
        Attempt to establish a connection with the server at the indicated address and port
        """
        if self.verbose:
            print("-"*50)
            string = "Looking for " + self.server_name + " server at: \n"
            string += "    Address: " + self.address.toString() + "\n"
            string += "    Port: " + str(self.port)
            print(string)

        # Attempt to connect to host.
        self.socket.connectToHost(self.address, self.port)

        if not self.socket.waitForConnected(1000):
            print(self.server_name + " server not found")

    def handleDisconnect(self):
        """
        Handles the disconnect from the socket.
        """
        self.comLostConnection.emit()

    def startCommunication(self):
        """
        Start communications with server
        """
        if not self.isConnected():
            self.connectToServer()
        return self.isConnected()

    def stopCommunication(self):
        """
        Stop communications with server.
        """
        if self.isConnected():
            self.socket.disconnectFromHost()


class StandAlone(QtWidgets.QMainWindow):
    """
    Stand Alone Test Class.
    """

    def __init__(self, **kwds):
        super().__init__(**kwds)

        # Create client
        self.client = TCPClient(port = 9500, server_name = "Test", verbose = True)

        self.client.messageReceived.connect(self.handleMessageReceived)
        self.client.startCommunication()

        self.message_ID = 1
        self.sendTestMessage()

    def sendTestMessage(self):
        """
        Send test messages.
        """
        if (self.message_ID == 1):
            # Create Test message
            message = TCPMessage(message_type = "Stage Position",
                                 message_data = {"Stage_X": 100.00, "Stage_Y": 0.00})
        elif (self.message_ID ==2):
            message = TCPMessage(message_type = "Movie",
                                 message_data = {"Name": "Test_Movie_01", "Parameters": 1})

        else:
            message = TCPMessage(message_type = "Done")
    
        self.message_ID += 1
        self.sent_message = message
        self.client.sendMessage(message)
        
    def handleMessageReceived(self, message):
        """
        Handle new message.
        """
        # Handle responses to messages
        if (self.sent_message.getID() == message.getID()):
            print(message)
        else:
            print("Received an unexpected message")

        self.sendTestMessage()

    def closeEvent(self, event):
        """
        Handle close event.
        """
        self.client.close()
        self.close()


# 
# Test/Demo of Class
#                         
if (__name__ == "__main__"):
    app = QtWidgets.QApplication(sys.argv)
    window = StandAlone()
    window.show()
    sys.exit(app.exec_())
