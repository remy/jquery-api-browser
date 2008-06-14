<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!--
    jQuery API browser.  Based on the createjQueryXMLDocs.pl script to generate the XML.
    
    I'd much rather see this hosted at http://jquery.com/api/ - so John - if you're 
    interested I'll get you the source code.  Until then, you can quickly browse
    the API in real time or via the URL at, e.g. http://remysharp.com/jquery-api/click
    
    @author remy sharp / http://remysharp.com
    @url http://leftlogic.com/jquery-api/
    @license: Creative Commons License - ShareAlike http://creativecommons.org/licenses/by-sa/2.5/
    @version: 1.0
-->
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <title>jQuery API</title>
    <link rel="search" type="application/opensearchdescription+xml" title="jQuery API" href="opensearch.xml" />
    <link rel="stylesheet" href="jquery-api.css" type="text/css" media="screen" charset="utf-8" />
</head>
<body>
    <noscript><p>This jQuery API browser requires JavaScript to be enabled.</p><p>Either enable JavaScript, or visit the <a href="http://docs.jquery.com">jQuery docs</a> web site</p></noscript>
    <p id="loading">Loading jQuery API docs</p>
    <h1>jQuery API &nbsp; <input type="text" id="query" name="q" autocomplete="off" value="<?=@$_GET['q']?>" /></h1>
    <ul id="alpha"></ul>
    <ul id="browser" class="filetree treeview-famfamfam">
    </ul>
    <div id="container">
        <ul id="docs"></ul>
    </div>
    <p id="footer" class="vcard">Built by <a class="url fn" href="http://remysharp.com">Remy Sharp</a> | jQuery API <span id="version"></span> | XML driven by <a href="http://docs.jquery.com">Wiki</a></p>
    
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js" type="text/javascript"></script>
<!-- must be loaded at the end of page to allow of updater -->
<script src="view.js" type="text/javascript"></script>
<script src="../api-loader.js" type="text/javascript"></script>
<script src="../api-docs.js" type="text/javascript"></script>
<script type="text/javascript" charset="utf-8">
var xmldoc = '<?=(@$_GET['xml']?$_GET['xml']:'')?>';
</script>
</body>
</html>





