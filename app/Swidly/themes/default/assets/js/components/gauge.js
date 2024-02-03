const template = document.createElement('template');
template.innerHTML = `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }
        .semi-donut{
            --percentage: 0;
            --fill: #ff0;
            --minValue: 0;
            --maxValue: 100;
            width: 250px;
            height: 125px;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: flex-end;

            &:after{
                content: '';
                width: 250px;
                height: 250px;
                border:50px solid;
                border-color : rgba(0,0,0,0.15) rgba(0,0,0,0.15) var(--fill) var(--fill);
                position: absolute;
                border-radius: 50%;
                left: 0;
                top: 0;
                box-sizing : border-box;
                transform: rotate( calc( 1deg * ( -45 + ((var(--percentage) / var(--maxValue)) * 100) * 1.8 ) ) );
                animation : fillAnimation 1s ease-in;
                transition : transform 1s ease-in;
            }

            .label {
                color: var(--fill); 
                font-size: 22px;
                font-weight: 600;
                display: block;
            }

            .container {  
                display: flex;
                align-items: center;
                justify-content: flex-end;
                box-sizing : border-box;
                flex-direction: column;
            }
        }
    </style>
    <div class="semi-donut margin" 
     style="--percentage : 0; --fill: #FF3D00 ; --minValue: 0; --maxValue: 100">
        <div class="container">
            <slot class="label" name="label">--</slot>
            <slot class="subLabel"></slot>
        </div>
    </div>
`;

class Gauge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Clone the template and append it to the shadow root
    const clone = template.content.cloneNode(true);
    this.shadowRoot.appendChild(clone);
  }

  connectedCallback() {
      const maxValue = this.getAttribute('maxValue');
      this.shadowRoot.querySelector('.semi-donut').style.setProperty('--maxValue', maxValue);
      this.updatePercentage(this.getAttribute('value'));
      this.shadowRoot
        .querySelector(".semi-donut")
        .style.setProperty("--fill", this.getAttribute("fill") || "#FF3D00");
  }

  disconnectedCallback() {
    // Perform actions when element is removed from the DOM
  }

  attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value') this.updatePercentage(newValue);
      if (name === 'fill') this.shadowRoot.querySelector(".semi-donut").style.setProperty("--fill", newValue);
  }

  static get observedAttributes() {
    // Return an array of observed attributes
    return ["value", "minValue", "maxValue", "fill"];
  }

  updatePercentage(value) {
      this.shadowRoot.querySelector('.semi-donut').style.setProperty('--percentage', value);
      this.shadowRoot.querySelector("slot[name='label']").textContent = value + 'w';
  }
}

customElements.define('semi-gauge', Gauge);
