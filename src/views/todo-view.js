import { LitElement, html } from "@polymer/lit-element";
import "@vaadin/text-field";
import "@vaadin/button";
import "@vaadin/checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/radio-group";

//filters for the radio
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
    //making state like functional component
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
      <div class="todos-list">
        ${this.applyFilter(this.todos).map(
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

      <vaadin-radio-group
        class="visibility-filters"
        value="${this.filter}"
        @value-changed="${this.filterChanged}">
        ${Object.values(VisibilityFilters).map(
          (filter) => html` <vaadin-radio-button value="${filter}">
            ${filter}
          </vaadin-radio-button>`
        )}
      </vaadin-radio-group>
      <vaadin-button @click="${this.clearCompleted}">
        Clear completed
      </vaadin-button>
    `;
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

  //For updating todo status
  updateTodoStatus(updatedTodo, complete) {
    this.todos = this.todos.map((todo) =>
      updatedTodo === todo ? { ...updatedTodo, complete } : todo
    );
  }

  //For changing the filter
  filterChanged(e) {
    this.filter = e.target.value;
  }

  //For clearing the completed task.
  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.complete);
  }

  //for applying the filter
  applyFilter(todos) {
    switch (this.filter) {
      case VisibilityFilters.SHOW_ACTIVE:
        return todos.filter((todo) => !todo.complete);
      case VisibilityFilters.SHOW_COMPLETED:
        return todos.filter((todo) => todo.complete);
      default:
        return todos;
    }
  }
}

customElements.define("todo-view", TodoView);
