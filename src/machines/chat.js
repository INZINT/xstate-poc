import { createMachine, assign, interpret } from "xstate";

const messagesMachine = createMachine(
  {
    context: {
      messages: [],
      createNewTodoFormInput: "",
    },
    id: "Chat machine",
    initial: "LOADING_MESSAGES",
    states: {
      LOADING_MESSAGES: {
        invoke: {
          src: "loadMessages",
          onDone: [
            {
              actions: "assignMessagesToContext",
              cond: "Has messages",
              target: "Messages Loaded",
            },
            {
              target: "Creating new message",
            },
          ],
        },
      },
      "Messages Loaded": {
        on: {
          "Create new": {
            target: "Creating new message",
          },
        },
      },
      //   "Loading messages errored": {},
      "Creating new message": {
        initial: "Showing form input",
        states: {
          "Showing form input": {
            on: {
              "Form input changed": {
                actions: "assignFormInputToContext",
              },
              Submit: {
                target: "Saving message",
              },
            },
          },
          "Saving message": {
            invoke: {
              src: "saveMessage",
              onDone: [
                {
                  target: "#Chat machine.LOADING_MESSAGES",
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    guards: {
      "Has messages": (context, event) => {
        return event.data.length > 0;
      },
    },
    actions: {
      assignMessagesToContext: assign((context, event) => {
        return {
          messages: event.data,
        };
      }),
      assignErrorToContext: assign((context, event) => {
        return {
          errorMessage: event.data.message,
        };
      }),
      assignFormInputToContext: assign((context, event) => {
        return {
          createNewTodoFormInput: event.value,
        };
      }),
    },
  }
);
const service = interpret(messagesMachine).onTransition((state) => {
  console.log(state.value);
});
service.start();

// Send events
service.send({ type: "initialise" });

// // Stop the service when you are no longer using it.
// service.stop();
export default messagesMachine;
