<?php
class word {
	public $text = '';
	public $size = 0;
}

ini_set('user_agent', 'NameOfAgent (shiva.virginia.edu)');

//check for robots.txt
function check_robots($url) {
	$scheme = parse_url($url, PHP_URL_SCHEME);
	$base = parse_url($url, PHP_URL_HOST);
	$robots = file_get_contents($scheme . "://" . $base . "/robots.txt");
	if (empty($robots)) {
		return FALSE;
	} else {
		$lines = preg_split('/$\R?^/m', $robots);
		$catch = false;
		foreach ($lines as $line) {
			if ($catch) {
				if (!preg_match('/^Dis/', $line)) {
					continue;
				} else if (preg_match('/^User-agent/', $line)) {
					break;
				}
				//else
				$rule = preg_split('/( |\t)/', $line);
				if (strpos($url, $rule[1])) {
					return true;
				}
			} else if ($line == "User-agent: *") {
				$catch = true;
			}
		}
	}
}

$rawtext = '';
if (!preg_match("/\s/", $_GET['url'])) {
	$url = $_GET['url'];
	if(!preg_match('/^http(s*):\/\//', $url)){
		$url= "http://".$url;
	}
	if (check_robots($url)) {
		exit(json_encode(array("error" => "robots")));
	} else {
		if (in_array('curl', get_loaded_extensions())) {
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$rawtext = curl_exec($ch);
		} else {
			$rawtext = file_get_contents($url);
		}
	}
} else {
	$rawtext = $_GET['url'];
}
if ($rawtext == FALSE) {
	exit(json_encode(array("error" => "fetch_fail")));
} else {
	$mime = explode(';', curl_getinfo($ch, CURLINFO_CONTENT_TYPE));
	$mime = $mime[0];
	#if not explicitly plaintext try finding body and strip tags
	if ($mime != 'text/plain') {
		$rawtext = html_entity_decode(strip_tags($rawtext));
	}
	$stop = array("a", "A", "about", "About", "above", "Above", "after", "After", "again", "Again", "against", "Against", "all", "All", "am", "Am", "an", "An", "and", "And", "any", "Any", "are", "Are", "aren\'t", "Aren\'t", "as", "As", "at", "At", "be", "Be", "because", "Because", "been", "Been", "before", "Before", "being", "Being", "below", "Below", "between", "Between", "both", "Both", "but", "But", "by", "By", "can\'t", "Can\'t", "cannot", "Cannot", "could", "Could", "couldn\'t", "Couldn\'t", "did", "Did", "didn\'t", "Didn\'t", "do", "Do", "does", "Does", "doesn\'t", "Doesn\'t", "doing", "Doing", "don\'t", "Don\'t", "down", "Down", "during", "During", "each", "Each", "few", "Few", "for", "For", "from", "From", "further", "Further", "had", "Had", "hadn\'t", "Hadn\'t", "has", "Has", "hasn\'t", "Hasn\'t", "have", "Have", "haven\'t", "Haven\'t", "having", "Having", "he", "He", "he\'d", "He\'d", "he\'ll", "He\'ll", "he\'s", "He\'s", "her", "Her", "here", "Here", "here\'s", "Here\'s", "hers", "Hers", "herself", "Herself", "him", "Him", "himself", "Himself", "his", "His", "how", "How", "how\'s", "How\'s", "i", "I", "i\'d", "I\'d", "i\'ll", "I\'ll", "i\'m", "I\'m", "i\'ve", "I\'ve", "if", "If", "in", "In", "into", "Into", "is", "Is", "isn\'t", "Isn\'t", "it", "It", "it\'s", "It\'s", "its", "Its", "itself", "Itself", "let\'s", "Let\'s", "me", "Me", "more", "More", "most", "Most", "mustn\'t", "Mustn\'t", "my", "My", "myself", "Myself", "no", "No", "nor", "Nor", "not", "Not", "of", "Of", "off", "Off", "on", "On", "once", "Once", "only", "Only", "or", "Or", "other", "Other", "ought", "Ought", "our", "Our", "ours ", "Ours ", "ourselves", "Ourselves", "out", "Out", "over", "Over", "own", "Own", "same", "Same", "shan\'t", "Shan\'t", "she", "She", "she\'d", "She\'d", "she\'ll", "She\'ll", "she\'s", "She\'s", "should", "Should", "shouldn\'t", "Shouldn\'t", "so", "So", "some", "Some", "such", "Such", "than", "Than", "that", "That", "that\'s", "That\'s", "the", "The", "their", "Their", "theirs", "Theirs", "them", "Them", "themselves", "Themselves", "then", "Then", "there", "There", "there\'s", "There\'s", "these", "These", "they", "They", "they\'d", "They\'d", "they\'ll", "They\'ll", "they\'re", "They\'re", "they\'ve", "They\'ve", "this", "This", "those", "Those", "through", "Through", "to", "To", "too", "Too", "under", "Under", "until", "Until", "up", "Up", "very", "Very", "was", "Was", "wasn\'t", "Wasn\'t", "we", "We", "we\'d", "We\'d", "we\'ll", "We\'ll", "we\'re", "We\'re", "we\'ve", "We\'ve", "were", "Were", "weren\'t", "Weren\'t", "what", "What", "what\'s", "What\'s", "when", "When", "when\'s", "When\'s", "where", "Where", "where\'s", "Where\'s", "which", "Which", "while", "While", "who", "Who", "who\'s", "Who\'s", "whom", "Whom", "why", "Why", "why\'s", "Why\'s", "with", "With", "won\'t", "Won\'t", "would", "Would", "wouldn\'t", "Wouldn\'t", "you", "You", "you\'d", "You\'d", "you\'ll", "You\'ll", "you\'re", "You\'re", "you\'ve", "You\'ve", "your", "Your", "yours", "Yours", "yourself", "Yourself", "yourselves", "Yourselves");
	$text = preg_replace('/[^a-z]+/i', '_', $rawtext);
	$words = explode('_', $text);
	$words = array_diff($words, $stop);
	$wordsAsoc = array();
	foreach ($words as $word) {
		$word = strtolower($word);
		if(array_key_exists($word, $wordsAsoc)) {
			++$wordsAsoc[$word];
		} else {
			$wordsAsoc[$word] = 1;
		}
	}
	unset($wordsAsoc['']);
	arsort($wordsAsoc);
	$json = array();
	$keys = array_keys($wordsAsoc);
	
	for ($i = 0; $i < count($keys); $i++) {
		$word = new word();
		$word -> text = $keys[$i];
		if(isset($_REQUEST['a'])){
			switch($_REQUEST['a']){
				case 'raw':
					$word -> freq = $wordsAsoc[$keys[$i]];
				break;
				case 'logarithmic':
					$word -> freq = log($wordsAsoc[$keys[$i]]+0.1);
				break;
				case 'binary':
					$word -> freq =  20;
				break;
				case 'normalized':
					$word -> freq = ($wordsAsoc[$keys[$i]]/$wordsAsoc[$keys[0]]);
				break;
			}
		}
		array_push($json, $word);
	}
	echo json_encode($json);
}
?>