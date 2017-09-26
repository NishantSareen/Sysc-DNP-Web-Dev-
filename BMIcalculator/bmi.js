var emailList = [];
window.onload = function () {  // on a page load this function takes all the email tag in the XML page and converts it into a sting stored in global variable emailList.
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            XMLhandler(this); // sends the xml data to the respective function
        }
    };
    xhttp.open("GET", "emails.xml", true);
    xhttp.send();

    function XMLhandler(xml) {
        var x, i, txt, xmlDoc;
        xmlDoc = xml.responseXML;
        x = xmlDoc.getElementsByTagName("email");
        for (i = 0; i < x.length; i++) {
            emailList.push(x[i].childNodes[0].nodeValue.toString()); // converts the node to a string to be added to the array.
        }
    }
}
function computeBMI() {
    var height = document.getElementById("Height").value;
    var weight = document.getElementById("weight").value;
    validateVitalStats(height, weight); // validates vitalstaistics form
    validateContactInfo(); // validates contact form 

}

    function validateVitalStats(height, weight) {
        var heightUnit, weightUnit, heightChecker, weightChecker;
        heightUnit = document.getElementById("heightunit").value;
        weightUnit = document.getElementById("weightunit").value;
        var heightInchRegex = /^(0?[0-9]{1,2}|1[0-7][0-9]|180)$/; //number from 0 to 118 inches in regex
        var weightPoundRegex = /^(0?[0-9]{1,3}|1[0][0-9][0-9]|1100)$/; // number from 0 to 1100 ppounds in regex
        var heightCentimeterRegex = /^(0?[0-9]{1,2}|[1-2][0-9][0-9]|300)$/;// number from 0 to 300 cm in regex
        var weightKiloRegex = /^(0?[0-9]{1,2}|[1-4][0-9][0-9]|500)$/; // number from 0 to 500 kg in regex
        var heightUnitsArr = ["inches", "centimeters"]; // array of height units
        var weightUnitsArr = ["pounds", "kilograms"]; // array of weight units
        var heightRegexArr = [heightInchRegex, heightCentimeterRegex]; // array of the regex height var created above
        var weightRegexArr = [weightPoundRegex, weightKiloRegex]; // array of the regex weight weight var created above
        var output = document.getElementById("output");

        if (heightUnitsArr[0] == heightUnit && weightUnitsArr[0] == weightUnit) { // inches and pounds unit checher
            regexchecker(heightRegexArr[0], weightRegexArr[0], height, weight, heightUnit, weightUnit, output); //corresponding input validation check
        }
        else if (heightUnitsArr[0] == heightUnit && weightUnitsArr[1] == weightUnit) { // inches and kilo checker
            regexchecker(heightRegexArr[0], weightRegexArr[1], height, weight, heightUnit, weightUnit, output);
        }
        else if (heightUnitsArr[1] == heightUnit && weightUnitsArr[0] == weightUnit) { // cm and pounds checker
            regexchecker(heightRegexArr[1], weightRegexArr[0], height, weight, heightUnit, weightUnit, output);
        }
        else if (heightUnitsArr[1] == heightUnit && weightUnitsArr[1] == weightUnit) {  // cm and kilograms checker
            regexchecker(heightRegexArr[1], weightRegexArr[1], height, weight, heightUnit, weightUnit, output);
        }
        return false;
    }

    function regexchecker(heightregex, weightregex, height, weight, heightUnit, weightUnit, output) {
        var statserrormessage = "Height must be in range [0-118]In or [0-300]Cm && Weight must be in range [0-300]Kg or [0-1100]Lb ";

        if (heightregex.test(height) == false) { // compares the input value to match the regex var
            output.innerHTML = statserrormessage;
        }
        else if (weightregex.test(weight) == false) {
            output.innerHTML = statserrormessage;
        }
        else { showResult(height, weight, heightUnit, weightUnit, output); }
    }

    function showResult(height, weight, heightUnit, weightUnit, output) {
        var BMI;
        var heightint = parseInt(height, 10); // converts to int for math operation below
        var weightint = parseInt(weight, 10);
        if (heightUnit == "inches") {
            heightint = (heightint * 2.54); // converts to metric
        }
        if (weightUnit == "pounds") {
            weightint = (weightint / 2.2); //converts to metric
        }
        BMI = (weightint / ((heightint * heightint) / 10000)).toFixed(1); // always calculates BMI in metric from the unit convertions above, decimal point fixed to 1 unit.
        var bmi = BMI.toString();
        if (document.getElementById("BMIdetailedcheck").checked == true) { // outputs the detalied analysis if true else just the BMI
            if (BMI < 18.5) {
                output.innerHTML = bmi + " : Your BMI suggests that you are underweight";
            }
            if (BMI < 25 && BMI >= 18.5) {
                output.innerHTML = bmi + " : Your BMI suggests that you have a reasonable weight";
            }
            if (BMI < 29 && BMI >= 25) {
                output.innerHTML = bmi + " : Your BMI suggests that you are overweight";
            }
            if (BMI >= 29) {
                output.innerHTML = bmi + " : Your BMI suggests that you may be obese";
            }
        } else { output.innerHTML = bmi + ""; }
    }

    function validateContactInfo() {
        var emailRegx = /^(.+)@([^\.].*)\.([a-z]{2,})$/; // regex vale for a valid email
        var nameRegex = /^[a-zA-Z\\s]*$/;  // regex value for a valid name                 
        var emailField = document.getElementById("email").value;
        var nameField = document.getElementById("name").value;
        var contacterror = document.getElementById("contacterror");
        var featuresupport = document.getElementById("featuresupport");
        var emailcheck = document.getElementById("BMIemailcheck");
        var bannedemails = document.getElementById("bannedemails");
        if (emailcheck.checked == true) { // if the checked box is true only then process the validation if not set the output flieds to null
            featuresupport.innerHTML = "The email sending feature is currently not supported.";
            if (emailRegx.test(emailField) == false) {
                contacterror.innerHTML = "The E-mail field is in an incorrect format.(should follow the current standard naming rules)";
            }
            else if (nameRegex.test(nameField) == false) {
                contacterror.innerHTML = "The Name field is in an incorrect format.(no numbers and special symbols)";
            } else { // if the e-mail id is banned from the emailList it then gives a response text saying that it is banned.
                contacterror.innerHTML = "";
                emailList.forEach(function (element) { // a foreach loop to check the email field against all the set array list values.
                    console.log(element);
                    if (element == emailField) {
                        bannedemails.innerHTML = element + " is a banned email";
                    }
                });
            }
        }
        if (emailcheck.checked == false) {
            featuresupport.innerHTML = null;
            contacterror.innerHTML = null;
        }
    }

    function resetBMI() {
        location.reload(true); //  this method reloads the page from the cache, but you can force it to reload the page from the server by setting the forceGet parameter to true
    }
