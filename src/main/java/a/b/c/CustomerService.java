package a.b.c;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class CustomerService {

	private static List<Customer> store = new ArrayList<Customer>() {
		{
			add(new Customer("顧客a", 35.716608, 139.722206));
			add(new Customer("顧客b", 35.719265, 139.727839));
			add(new Customer("顧客c", 35.720101, 139.729829));
			add(new Customer("顧客d", 35.719748, 139.731374));
			add(new Customer("顧客e", 35.718485, 139.732592));
			add(new Customer("顧客f", 35.717592, 139.733118));
			add(new Customer("顧客g", 35.703444, 139.772632));
			add(new Customer("顧客h", 35.704158, 139.775100));
			add(new Customer("顧客i", 35.705354, 139.778722));
			add(new Customer("顧客l", 35.706922, 139.780428));
		}
	};

	@RequestMapping(method = RequestMethod.GET)
	public List<Customer> get() {
		return store;
	}

}
