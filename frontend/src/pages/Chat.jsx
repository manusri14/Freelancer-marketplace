import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { userId } = useParams(); // The ID of the person we are chatting with
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Connect to Socket
    socketRef.current = io(import.meta.env.VITE_API_URL);
    
    socketRef.current.emit('setup', user);
    socketRef.current.emit('join chat', userId); // We use the other user's ID or a unique room ID. For simplicity we join a room based on the two users.
    
    // In our backend we didn't specify room joining thoroughly except `socket.join(room)`, but the logic was simple.
    // Let's just fetch the chat history first.
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch Messages
        const { data } = await axios.get(`/api/chat/${userId}`, config);
        setMessages(data.data);
        
        // Let's try to get the other user's details. We'll use a generic approach or derive from messages.
        if (data.data.length > 0) {
           const firstMsg = data.data[0];
           if (firstMsg.sender._id === userId) setOtherUser(firstMsg.sender);
           else if (firstMsg.sender === userId) setOtherUser({ _id: userId, name: 'User' }); // fallback
        }

      } catch (error) {
        console.error('Failed to load chat history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();

    socketRef.current.on('message received', (newMessageReceived) => {
      if (newMessageReceived.sender._id === userId || newMessageReceived.sender === userId) {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.post(`/api/chat/${userId}`, { message: newMessage }, config);
      
      setMessages([...messages, data.data]);
      setNewMessage('');
      
      socketRef.current.emit('new message', data.data);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  if (loading) return <div className="text-center py-20">Loading chat...</div>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4 flex items-center">
        <Link to={user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'} className="mr-4 text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Chat {otherUser?.name ? `with ${otherUser.name}` : ''}
        </h1>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-900/50">
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
              No messages yet. Say hi!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.sender._id === user._id || msg.sender === user._id;
              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-600 rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <span className={`text-[10px] mt-1 block ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              placeholder="Type your message..."
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center"
            >
              <Send size={20} className="mr-2" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
