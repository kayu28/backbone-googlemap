package a.b.c;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctor")
public class DoctorService {

	private static List<Doctor> store = new ArrayList<Doctor>() {
		{
			add(new Doctor("嘱託医a", 35.700804, 139.774144));
			add(new Doctor("嘱託医b", 35.700569, 139.771054));
			add(new Doctor("嘱託医c", 35.700804, 139.769305));
			add(new Doctor("嘱託医d", 35.702677, 139.766966));
			add(new Doctor("嘱託医e", 35.699630, 139.774836));
		}
	};

	@RequestMapping(method = RequestMethod.GET)
	public List<Doctor> get() {
		return store;
	}

}
