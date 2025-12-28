import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5003', {
      autoConnect: true,
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected')
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })
  }

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
