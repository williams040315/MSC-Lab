#!/usr/bin/env python
"""
A TCP communications class that provides the basic methods for relaying TCP messages.
"""

from PyQt5 import QtCore, QtNetwork

from library.tcpMessage import TCPMessage


class TCPCommunicationsMixin(object):
    """
    A mixin class that defines the basic process of exchanging TCP 
    messages. Client and servers (multi-) inherit this class.

    They will should also include the following signal:
    messageReceived = QtCore.pyqtSignal(object)
    """
    def __init__(self,
                 address = QtNetwork.QHostAddress(QtNetwork.QHostAddress.LocalHost),
                 encoding = 'utf-8',
                 port = 9500,
                 server_name = "default",
                 verbose = False,
                 **kwds):
        super().__init__(**kwds)

        # Initialize internal attributes
        self.address = address
        self.encoding = encoding
        self.port = port 
        self.server_name = server_name
        self.socket = None
        self.verbose = verbose
    
    def close(self):
        """
        Close the socket.
        """
        if self.socket:
            self.socket.close()
            if self.verbose:
                print("Closing TCP communications: " + self.server_name)
            
    def handleBusy(self):
        """
        Handle a busy message. Reserved for future use.
        """
        pass

    def handleReadyRead(self):
        """
        Create TCP message class from JSON message and forward as appropriate
        """
        message_str = ""
        while self.socket.canReadLine():
            # Read data line
            message_str += str(self.socket.readLine(), self.encoding)

        # Create message.
        message = TCPMessage.fromJSON(message_str)
        if self.verbose:
            print("Received: \n" + str(message))

        if (message.getType() == "Busy"):
            self.handleBusy()
        else:
            self.messageReceived.emit(message)
    
    def isConnected(self):
        """
        Return true if the socket is connected and active.
        """
        if self.socket and (self.socket.state() == QtNetwork.QAbstractSocket.ConnectedState):
            return True
        else:
            return False

    def sendMessage(self, message):
        """
        Send TCP message as JSON string if the socket is connected.
        """
        if self.isConnected():
            message_str = message.toJSON() + "\n"
            self.socket.write(message_str.encode(self.encoding))
            self.socket.flush()
            if self.verbose:
                print("Sent: \n" + str(message))
        else:
            print(self.server_name + " socket not connected. \nDid not send:" )
            message.setError(True, "Communication Error: " + self.server_name + " socket not connected")
            print(message)
            self.messageReceived.emit(message) # Return message with error
