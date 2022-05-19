let model = "app"

function redirect(lastmodel) {
    switch (lastmodel) {
        case "LoanPayoffCalculator":
            window.location.href = "loan.html";
            break
        case "PlanCalculator":
            window.location.href = "plan.html";
            break
        case "ContributionCalculator":
            window.location.href = "save.html";
            break
        case "JobCalculator":
            window.location.href = "switch.html";
            break
        default:
            window.location.href = "save.html";
    }
    

}
