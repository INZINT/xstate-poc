import './App.css';
import {useEffect, useState} from "react";
import {useMachine} from '@xstate/react';
import messagesMachine from "./machines/chat";

const messages = [];

function App() {
    const [state, send] = useMachine(messagesMachine, {
        services: {
            loadMessages: async () => {
                return messages;
            },
            saveMessage: async (context, event) => {
                console.log("messages",messages)
                messages.push(context.createNewTodoFormInput);
            },

        },
    });
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    useEffect(() => {
        send('initialise')
    }, [])

    console.log("state",state.event.type)
    return (
        <div className="container">
            <div className="jumbotron">
                <h1 className="display-4">Chat App</h1>
            </div>

            <div className="container-fluid bg-light" id="chat">
                <div className="content d-flex flex-column" id="chat-content">
                    {state.context.messages?.map(msg => {
                        return <span id="msg-0" className="msg">
                                    <div className="head"> User </div>
                                    <p className="body"> {msg} </p>
                                    <div className="footer"> 8:44:37 AM </div>
                                </span>
                    })}
                </div>
                {state.matches("Messages Loaded") && (
                    <button
                        className="btn btn-primary "
                        onClick={() => {
                            send({
                                type: "Create new",
                            });
                        }}
                    >
                        Create new
                    </button>
                )}
                {state.matches("Creating new message.Showing form input") && (
                    <>

                        <form className="tools form-row"
                              onSubmit={(e) => {
                                  e.preventDefault();
                                  send({
                                      type: "Submit",
                                  });
                              }}
                        >
                            {state.event.type==="Form input changed"  && <p className="typing">Typing...</p>}
                            <input
                                placeholder="Type message..."
                                id="newMessage" className="form-control col mr-2"
                                onChange={(e) => {
                                    send({
                                        type: "Form input changed",
                                        value: e.target.value,
                                    });
                                }}
                            />
                        </form>
                    </>
                )}

            </div>
        </div>
    );
}

export default App;
