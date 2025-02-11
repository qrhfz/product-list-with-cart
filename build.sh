if [ -d build ]; then rm build; fi
mkdir build
cp -r index.html data.json assets scripts build
sass sass/style.scss build/style.css