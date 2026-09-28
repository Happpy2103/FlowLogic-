/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package resource;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

/**
 *
 * @author Happy Patel
 */
@Path("/test")
public class TestResource {

    @GET
    public String test() {
        return "TEST WORKING";
    }
}
