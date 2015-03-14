<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
</head>
<body>
	<h1>IT Service Outage Bulleting</h1>

	<p>Title: {{title}}</p>
	<p>ITSB Reason: {{reason}}</p>
	<p>Regions affected: {{regions}}</p>
	<p>Outage Start Time: {{outage_start_time | date: 'medium'}}</p>
	<br>
	<br>
	<p>Services affected: {{services}}</p>
	<p>Business Impact: {{biz_impact}}</p>
</body>
</html>