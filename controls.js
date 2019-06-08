function updateCharge() {
    NEW_CHARGE_TYPE = parseInt(document.querySelector(".charge-selection-current-option").getAttribute("data-type")) * CHARGE_UNIT
}

function init() {
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, options);
}

function main() {
    init()
    const controls = document.getElementById("controls")
    document.getElementById("hide-controls").addEventListener("click", e => {
        if (controls.classList.contains("hidden")) {
            controls.style.width = ""
            controls.style.height = ""
            for (let obj of controls.childNodes) {
                if (obj.id !== "hide-controls" && obj.style !== undefined) obj.style.display = ""
            }
            controls.classList.remove("hidden")
            hideControls.querySelector(".icon").innerText = "remove"
        } else {
            for (let obj of controls.childNodes) {
                if (obj.id !== "hide-controls" && obj.style !== undefined) obj.style.display = "none"
            }
            hideControls = document.getElementById("hide-controls")
            controls.style.width = `calc(2vw + ${hideControls.offsetWidth}px)`
            controls.style.height = `calc(2vw + ${hideControls.offsetHeight}px)`
            controls.classList.add("hidden")
            hideControls.querySelector(".icon").innerText = "add"
        }
    })
    for (let chargeOption of document.getElementsByClassName("charge-selection-option")) {
        if (Math.sign(NEW_CHARGE_TYPE) === parseInt(chargeOption.getAttribute("data-type"))) chargeOption.classList.add("charge-selection-current-option")
        chargeOption.addEventListener("click", e => {
            currentOption = document.querySelector(".charge-selection-current-option")
            if (chargeOption !== currentOption) {
                currentOption.classList.remove("charge-selection-current-option")
                chargeOption.classList.add("charge-selection-current-option")
                NEW_CHARGE_TYPE = parseInt(chargeOption.getAttribute("data-type")) * CHARGE_UNIT
            }
        })
    }
    let k = document.getElementById("k")
    k.addEventListener("input", () => {
        environment.k = math.eval(M.FormSelect.getInstance(k).getSelectedValues()[0])
    })
    environment.k = math.eval(M.FormSelect.getInstance(k).getSelectedValues()[0])
    let stride = document.getElementById("stride")
    stride.addEventListener("change", () => {
        STRIDE = stride.value
        let width = Math.floor((windowWidth - MARGIN[0] - MARGIN[2]) / STRIDE)
        let height = Math.floor((windowHeight - MARGIN[1] - MARGIN[3]) / STRIDE)
        grid.reshape(width, height)
    })
    stride.value = STRIDE
    let unitMap = {
        "0": "C",
        "-3": "mC",
        "-6": "&micro;C",
        "-9": "nC"
    }
    let chargeUnit = document.getElementById("charge-unit")
    let getUnitLabel = power => {
        u = unitMap[power.toString()]
        if (u === undefined) u = `1e${power}`
        return u
    }
    chargeUnit.addEventListener("input", () => {
        CHARGE_UNIT = Math.pow(10, chargeUnit.value)
        if (NEW_CHARGE_TYPE !== 0) NEW_CHARGE_TYPE = CHARGE_UNIT * Math.sign(NEW_CHARGE_TYPE)
        chargeUnitDisplay = document.getElementById("charge-unit-display")
        chargeUnitDisplay.innerHTML = getUnitLabel(chargeUnit.value)
    })
    chargeUnit.value = -6
    document.getElementById("charge-unit-display").innerHTML = getUnitLabel(-6)
    let reset = document.getElementById("reset-btn")
    reset.addEventListener("click", () => environment.charges = [])
}