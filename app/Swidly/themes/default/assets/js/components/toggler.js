const togglerTemplate = document.createElement("template");
togglerTemplate.innerHTML = `

    <style>
.switch {
  --width: 60px;
  --height: calc(var(--width) / 2);
  --border-radius: calc(var(--height) / 2);
  
  display: inline-block;
  cursor: pointer;

  & .switch__input {
    display: none;
  }
  
  & .switch__fill {
    position: relative;
    width: var(--width);
    height: var(--height);
    border-radius: var(--border-radius);
    background: #ddd;
    transition: all 0.2s;

    &::before {
        content: attr(data-label);
        position: absolute;
        width: auto;
        height: fit-content;
        top: 50%;
        transform: translateY(-50%);
        left: -50%;
        right: 0;
        margin: 0 auto;
        transition: all 0.2s;
        font-weight: 700;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: var(--height);
      height: var(--height);
      background: #eee;
      top: 0;
      left: 0;
      border-radius: var(--border-radius);
      box-shadow: 0 0 10 rgba(162, 162, 162, 0.566);
      transition: all 0.2s;
      text-align: center;
      color: white;
      font-weight: bold;
      font-family: Arial;
      font-size: calc(var(--height) / 2);
      verticle-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  & .switch__input:checked ~ .switch__fill {
    background: #03ba96af;
    
    &::after {
      transform: translateX(var(--height));
    }
  }
}
    </style>

    <label class="switch" for="tglBtn">
        <input type="checkbox" class="switch__input" id="tglBtn" />
        <div class="switch__fill"></div>
    </label>
`;

class Togger extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Clone the template and append it to the shadow root
    const clone = togglerTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(clone);
  }

    connectedCallback() {
        this.shadowRoot.querySelector(".switch__input").addEventListener("change", () => {
            window.eventEmitter.emit('toggled', {
                type: this.getAttribute('type'),
                state: this.shadowRoot.querySelector(".switch__input").checked
            });
        });

        const label = this.getAttribute('label');

        if (label) {
            this.shadowRoot.querySelector(".switch__fill").setAttribute('data-label', label);
        }
    }

    disconnectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'state') {
            if (newValue === 'true') {
                this.shadowRoot.querySelector(".switch__input").checked = true;
            } else {
                this.shadowRoot.querySelector(".switch__input").checked = false;
            }
        }
    }

    static get observedAttributes() {
        return ["state", "type"];
    }
}

customElements.define("toggler-switch", Togger);