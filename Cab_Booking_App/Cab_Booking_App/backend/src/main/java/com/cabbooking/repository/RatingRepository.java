package com.cabbooking.repository;

import com.cabbooking.entity.Driver;
import com.cabbooking.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByDriver(Driver driver);
}
