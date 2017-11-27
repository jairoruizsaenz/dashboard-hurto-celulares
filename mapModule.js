var layerOSM = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var raster = new ol.layer.Tile({
    source: new ol.source.TileJSON({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.world-dark.json?secure'
    })
});

var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
    })
});
var style2 = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.3)',
    }),
    stroke: new ol.style.Stroke({
        color: '#0F0',
        width: 1
    })
});

var vector = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://openlayers.org/en/v4.4.2/examples/data/topojson/world-110m.json',
        format: new ol.format.TopoJSON({
            // don't want to render the full world polygon (stored as 'land' layer),
            // which repeats all countries
            layers: ['countries']
        }),
        overlaps: false
    }),
    style: style
});

var vectorBarrios = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://raw.githubusercontent.com/JofreManchola/demo-topojson/master/GeoJSON/json/topo_barriosprueba.json',
        format: new ol.format.TopoJSON(
            //     {
            //     // don't want to render the full world polygon (stored as 'land' layer),
            //     // which repeats all countries
            //     layers: ['states']
            // }
        ),
        overlaps: false
    }),
    style: style2
});

var map = new ol.Map({
    // layers: [layerOSM, raster, vectorBarrios],
    layers: [layerOSM, vectorBarrios],
    target: 'map',
    view: new ol.View({
        center: [-8246524.650205424, 519536.4867323131],
        zoom: 11
    })
});