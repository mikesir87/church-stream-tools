# Church Stream Tools

This project provides the source code for the various stream tools used for our local church congregation. The site consists of:

- A landing page with information on how to install and configure OBS
- A remote control webapp that provides the ability to control the broadcast from anywhere (assuming you have a network path between the devices)

**Note:** This project is not endorsed or supported by The Church of Jesus Christ of Latter-Day Saints. It was created solely by an individual to support a local congregation and made available for others to use as well.

## Development

This project provides a `docker-compose.yml` file, making it possible to simply run:

```
docker compose up
```

Once the containers have started, you can open [http://localhost](http://localhost) and view the site. The remote control can be found at [http://localhost/controller](http://localhost/controller). 

The controller (a React app) will hot-reload changes and the landing page will require a page refresh.


## Acknowledgments

The landing page is a modified version of the [Agency Start Bootstrap template](https://startbootstrap.com/theme/agency).
