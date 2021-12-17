function passwordToggle() {
    let x = document.getElementById('signin-password');
    if (x.type === 'password') {
        x.type = 'text';
    } else {
        x.type = 'password';
    }
}
