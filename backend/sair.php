<?php
session_start();
$_SESSION['email'] = "";
$_SESSION['nome'] = "";
session_destroy();

header("location:/vivadanca/admin.php");
?>