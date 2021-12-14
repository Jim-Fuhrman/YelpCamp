mapboxgl.accessToken = mapToken
/*console.log(campground)*/
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: campground.geometry.coordinates,
  zoom: 10
})

map.addControl(new mapboxgl.NavigationControl())

/*let popUp = new mapboxg1.Popup({ offset: 25 }) */
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3>`))
  .addTo(map)
