import { LitElement, html } from "@polymer/lit-element";
import "@vaadin/text-field";
import "@vaadin/button";
import "@vaadin/checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/radio-group";

const VisibilityFilters = {
  SHOW_ALL: "All",
  SHOW_ACTIVE: "Active",
  SHOW_COMPLETED: "Completed",
};

class TodoView extends LitElement {
  //defining the properties using static getter
  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String },
    };
  }

  constructor() {
    super();
    this.todos = [];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = "";
  }

  render() {
    return html`
      <div className="input-layout" @keyup="${this.shortcutListener}">
        <vaadin-text-field
          placeholder="Task"
          value=${this.task}
          @change=${this.updateTask}></vaadin-text-field>
        <vaadin-button theme="primary" @click=${this.addToDo}
          >Add todo</vaadin-button
        >
      </div>

      <!--To display the todo's-->
      <div class="todo-list">
        ${this.todos.map(
          (todo) => html`
            <div class="todo-item">
              <vaadin-checkbox
                ?checked="${todo.complete}"
                @change="${(e) =>
                  this.updateTodoStatus(todo, e.target.checked)}"
                @change
                >${todo.task}</vaadin-checkbox
              >
            </div>
          `
        )}
      </div>
    `;
  }

  updateTodoStatus(updatedTodo, complete) {
    this.todos = this.todos.map((todo) =>
      updatedTodo === todo ? { ...updatedTodo, complete } : todo
    );
  }

  //IF the user press Enter button after input
  shortcutListener(e) {
    if (e.key === "Enter") {
      this.addToDo();
    }
  }

  //update the input field
  updateTask(e) {
    this.task = e.target.value;
  }

  //Checking if the todo list is empty or not
  addToDo() {
    if (this.task) {
      this.todos = [
        ...this.todos,
        {
          task: this.task,
          complete: false,
        },
      ];
      this.task = "";
    }
  }
}

customElements.define("todo-view", TodoView);
