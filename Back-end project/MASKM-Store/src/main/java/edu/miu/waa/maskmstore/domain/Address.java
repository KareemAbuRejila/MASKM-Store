package edu.miu.waa.maskmstore.domain;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class Address {

    @Id
    @GeneratedValue
    private Long id;

    @NotEmpty
    String country;
    @NotEmpty
    String city;

    String state;

    @NotEmpty
    String addressLine;

    @NotEmpty
    @Digits(integer = 5, fraction = 0,message = "Size.Zip")
    long zipCode;
}
