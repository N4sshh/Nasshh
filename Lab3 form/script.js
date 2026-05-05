$(document).ready(function() {

    function showError(inputId, errorId, message) {
        $(inputId).addClass("input-error").removeClass("input-success");
        $(errorId).text(message).show();
        $(errorId.replace("-error", "-ok")).hide();
    }

    function showSuccess(inputId, okId) {
        $(inputId).addClass("input-success").removeClass("input-error");
        $(okId).show();
        $(okId.replace("-ok", "-error")).text("").hide();
    }

    function validateName() {
        var val = $("#full-name").val().trim();
        if (!val) { showError("#full-name", "#name-error", "Full name is required."); return false; }
        if (val.length < 3) { showError("#full-name", "#name-error", "Min 3 characters."); return false; }
        showSuccess("#full-name", "#name-ok");
        return true;
    }

    function validateStudentID() {
        var val = $("#student-id").val().trim();
        if (!val) { showError("#student-id", "#sid-error", "Student ID is required."); return false; }
        if (!/^\d{2}-\d{5}$/.test(val)) { showError("#student-id", "#sid-error", "Format: YY-NNNNN."); return false; }
        showSuccess("#student-id", "#sid-ok");
        return true;
    }

    function validateEmail() {
        var val = $("#email").val().trim();
        if (!val) { showError("#email", "#email-error", "Email is required."); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError("#email", "#email-error", "Enter a valid email."); return false; }
        showSuccess("#email", "#email-ok");
        return true;
    }

    function validateCourse() {
        if (!$("#course").val()) { showError("#course", "#course-error", "Please select your course."); return false; }
        showSuccess("#course", "#course-ok");
        return true;
    }

    function validatePassword() {
        var val = $("#password").val();
        var score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        var colors = ["", "#e11d48", "#d97706", "#1a6ef5", "#16a34a"];
        var labels = ["", "Weak", "Fair", "Good", "Strong"];
        var widths = ["0%", "25%", "50%", "75%", "100%"];

        $("#pw-strength-fill").css({ "width": widths[score], "background": colors[score] });
        $("#pw-strength-label").text(score > 0 ? labels[score] : "").css("color", colors[score]);

        if (!val) { showError("#password", "#pw-error", "Password is required."); return false; }
        if (val.length < 8) { showError("#password", "#pw-error", "Minimum 8 characters."); return false; }
        if (!/[A-Z]/.test(val)) { showError("#password", "#pw-error", "Add an uppercase letter."); return false; }
        if (!/[0-9]/.test(val)) { showError("#password", "#pw-error", "Add a number."); return false; }
        showSuccess("#password", "#pw-ok");
        return true;
    }

    function validateConfirmPassword() {
        var pw = $("#password").val();
        var cpw = $("#confirm-pw").val();
        if (!cpw) { showError("#confirm-pw", "#cpw-error", "Please confirm your password."); return false; }
        if (pw !== cpw) { showError("#confirm-pw", "#cpw-error", "Passwords do not match."); return false; }
        showSuccess("#confirm-pw", "#cpw-ok");
        return true;
    }

    function validateTerms() {
        if (!$("#terms").is(":checked")) {
            $("#terms-error").text("You must agree to the Terms.").show();
            return false;
        }
        $("#terms-error").text("").hide();
        return true;
    }

    // Live validation
    $("#full-name").on("input", validateName);
    $("#student-id").on("input", validateStudentID);
    $("#email").on("input", validateEmail);
    $("#course").on("change", validateCourse);
    $("#password").on("input", validatePassword);
    $("#confirm-pw").on("input", validateConfirmPassword);
    $("#terms").on("change", validateTerms);
    $("#password").on("input", function() {
        if ($("#confirm-pw").val() !== "") validateConfirmPassword();
    });

    function resetForm() {
        $("#reg-form")[0].reset();
        $("input,select").removeClass("input-error input-success");
        $(".error-msg").text("").hide();
        $(".success-icon").hide();
        $("#pw-strength-fill").css({ "width": "0%", "background": "" });
        $("#pw-strength-label").text("");
    }

    $("#reg-form").submit(function(e) {
        e.preventDefault();
        var ok = validateName() & validateStudentID() & validateEmail() &
                 validateCourse() & validatePassword() & validateConfirmPassword() & validateTerms();

        if (ok) {
            $("#s-name").text($("#full-name").val().trim());
            $("#s-sid").text($("#student-id").val().trim());
            $("#s-email").text($("#email").val().trim());
            $("#s-course").text($("#course option:selected").text());

            $("#reg-form").slideUp(400, function() {
                $("#success-card").fadeIn(500);
            });
        } else {
            var f = $(".input-error").first();
            if (f.length) $('html,body').animate({ scrollTop: f.offset().top - 80 }, 400);
        }
    });

    $("#btn-reset").click(resetForm);

    $("#btn-new").click(function() {
        $("#success-card").fadeOut(300, function() {
            resetForm();
            $("#reg-form").slideDown(400);
        });
    });

});