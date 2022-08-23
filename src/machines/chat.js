import {createMachine} from 'xstate';

const chatMachine = createMachine({
	"id": "ChatMachine",
	"initial": "init",
	"states": {
		"init": {
			"on": {
				"initialise": {
					"target": "initialised"
				}
			}
		},
		"initialised": {
			"on": {
				"reply": {
					"target": "replyChat"
				},
				"chat": {
					"target": "activeChat"
				},
				"forward": {
					"target": "forwardChat"
				},
			}
		},
		"replyChat": {
			"on": {
				"startThread": {
					"target": "activeChat"
				}
			}
		},
		"newChat": {
			"on": {
				"startTyping": {
					"target": "typing"
				},
				"endTyping": {
					"target": "sendMessage"
				}
			}
		},
		"typing": {
			always: [
				{
					target: '',
					cond: 'getMessage'
				},
				{
					target: 'loading'
				}
			]
		},
		'loading': {},
		"activeChat": {
			"on": {
				"startReplyChat": {
					"target": "replyChat"
				},
				"startForwardChat": {
					"target": "forwardChat"
				},
				"startNewChat": {
					"target": "newChat"
				},
				"endChat": {
					"target": "end"
				}
			}
		},
		"forwardChat": {
			"on": {
				"endChat": {
					"target": "end"
				}
			}
		},
		"end": {
			type: 'final'
		}
	}
}, {
	guards: {
		getMessage: (context)=>{
			return !!context.message
		}
	}
});