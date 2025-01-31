function parseInches(input) {
  const parts = input.trim().split(" ");
  let inches = 0;

  if (parts.length === 2) {
      inches += parseInt(parts[0], 10);
      const fraction = parts[1].split("/");
      inches += parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
  } else if (parts.length === 1) {
      const fraction = parts[0].split("/");
      if (fraction.length === 2) {
          inches += parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
      } else {
          inches += parseFloat(parts[0]);
      }
  }

  return inches;
}

function updateImage() {
    const selectedValue = document.getElementById("rl-or-lr").value;
    const image = document.getElementById("diagram");
    // Update image source

    if (selectedValue === "RL") {
        image.src = "img/info/RL.png";
    } else {
        image.src = "img/info/LR.png"
    }

}

// Initialize to show inputs for the default image
updateImage();

function decimalToInches(decimal) {
    if (decimal < 0) {
        throw new Error("Input must be a non-negative number");
    }

    const inches = Math.floor(decimal); // Get the whole inches
    const fraction = decimal - inches; // Get the fractional part
    const fractionsOfInch = 16; // Precision to 1/16 of an inch
    const fractionRounded = Math.round(fraction * fractionsOfInch); // Round to nearest 1/16

    // Handle special cases where fractionRounded equals fractionsOfInch
    if (fractionRounded === fractionsOfInch) {
        return `${inches + 1}"`;
    }

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b)); 
    const denominator = fractionsOfInch;
    const numerator = fractionRounded;

    // Reduce fraction
    const divisor = gcd(numerator, denominator);
    const simplifiedNumerator = numerator / divisor;
    const simplifiedDenominator = denominator / divisor;

    // Format the result
    if (inches === 0 && simplifiedNumerator > 0) {
        return `${simplifiedNumerator}/${simplifiedDenominator}"`; // Only fraction
    } else if (simplifiedNumerator > 0) {
        return `${inches} ${simplifiedNumerator}/${simplifiedDenominator}"`; // Whole inches and fraction
    } else {
        return `${inches}"`; // Only whole inches
    }
}


document.getElementById("calcForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const width = parseInches(document.getElementById("inputWidth").value);
  const length = parseInches(document.getElementById("inputLength").value);
  const diagonal = parseInches(document.getElementById("diagonal").value);
  const railDistance = parseInches(document.getElementById("inputRails").value);

  // Calculate opposite angle using the law of cosines
  const calculatedAngle = (Math.acos((Math.pow(diagonal, 2) - Math.pow(width, 2) - Math.pow(length, 2)) / -(2 * width * length)) * 180) / Math.PI;
  const angleError = calculatedAngle - 90;

  // Calculate expected diagonal
  const expectedDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(length, 2));

  let adjustmentMessage = "";
  
  const bigger_diagonal = document.getElementById("rl-or-lr").value;

  if (Math.abs(angleError) > 0.1) { 
    let shiftDistance = Math.tan(angleError * (Math.PI / 180)) * railDistance;
    shiftDistance = Math.abs(shiftDistance).toFixed(2);
        if (bigger_diagonal === 'RL') {
        adjustmentMessage = `Move the left side forward by ${decimalToInches(shiftDistance)} (${shiftDistance}") or the right side backwards by ${decimalToInches(shiftDistance)} (${shiftDistance}").`;
    } else {
        adjustmentMessage = `Move the right side forward by ${decimalToInches(shiftDistance)} (${shiftDistance}") or the left side backwards by ${decimalToInches(shiftDistance)} (${shiftDistance}").`;
    }
  } else {
        adjustmentMessage = "The machine is properly calibrated.";
  }

  document.getElementById("expected_diagonal").textContent = `Expected Diagonal: ${decimalToInches(expectedDiagonal.toFixed(2))} (${expectedDiagonal.toFixed(2)}")`;
  document.getElementById("adjust_message").textContent = adjustmentMessage;
});
