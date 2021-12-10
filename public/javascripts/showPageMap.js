mapboxgl.accessToken = mapToken
/*console.log(campground)*/
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: campground.geometry.coordinates,
  zoom: 8
})

let marker = new mapboxgl.Marker().setLngLat([(-74.5, 40)]).addTo(map)
