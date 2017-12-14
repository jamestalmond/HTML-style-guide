//
////
////// Switch view button
////
//

(function() {
	let btn = document.querySelector('.switch-view');
	let list = document.querySelector('.p-list');

	if (localStorage.getItem('pListView') === 'grid') {
		list.classList.add('grid');
	}

	btn.addEventListener('click', function() {
		if (list.classList.contains('grid')) {
			list.classList.remove('grid');
			localStorage.removeItem('pListView');
		} else {
			list.classList.add('grid');
			localStorage.setItem('pListView', 'grid');
		}
	});
})();

//
////
////// Document query
////
//

const bodyElement = document.querySelector('body');

console.dir(bodyElement.style); // eslint-disable-line no-console

if (bodyElement.style.grid === '') {
	console.log(true); // eslint-disable-line no-console
} else {
	console.log(false); // eslint-disable-line no-console
}
