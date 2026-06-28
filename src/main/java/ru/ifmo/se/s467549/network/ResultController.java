package ru.ifmo.se.s467549.network;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;

import jakarta.validation.Valid;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.s467549.model.Result;
import ru.ifmo.se.s467549.model.User;
import ru.ifmo.se.s467549.service.ResultModelAssembler;
import ru.ifmo.se.s467549.persistence.ResultRepository;
import ru.ifmo.se.s467549.service.AreaCheckService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

// @RestController means that data will be written straight into the response body instead of rendering template
@RestController
public class ResultController {

    private final ResultRepository repository;

    // injecting assembler to controller
    private final ResultModelAssembler assembler;

    private final AreaCheckService areaCheckService;

    public ResultController(ResultRepository repository, ResultModelAssembler assembler, AreaCheckService areaCheckService) {
        this.repository = repository;
        this.assembler = assembler;
        this.areaCheckService = areaCheckService;
    }

    /**
     * we make root return HAL mediatype
     * CollectionModel is HATEOAS container aimed to encapsulate collections of resources
     *
     * @return CollectionModel<EntityModel < Result>>
     */
    // Aggregate root
    // tag::get-aggregate-root[]
    @GetMapping("/api/results")
    public PagedModel<EntityModel<Result>> all(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            PagedResourcesAssembler<Result> pagedAssembler
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        // all points of User user
//        List<EntityModel<Result>> results = repository.findByUser(user).stream()
//                .map(assembler::toModel)
//                .collect(Collectors.toList());
        Page<Result> resultsPage = repository.findByUser(user, pageable);

//        return CollectionModel.of(results,
//                linkTo(methodOn(ResultController.class).all(user)).withSelfRel());
        return pagedAssembler.toModel(resultsPage, assembler);
    }

    /**
     * make new entity and wrap it into ResponseEntity to make HTTP 201 created status
     *
     * @param newResult, here i use @valid to check params without using db
     * @return ResponseEntity
     */
    @PostMapping("/api/results")
    public ResponseEntity<?> newResult(@Valid @RequestBody Result newResult, @AuthenticationPrincipal User user) {

        boolean isHit = areaCheckService.isHit(newResult.getX(), newResult.getY(), newResult.getR());

        newResult.setHit(isHit);
        newResult.setTimestamp(LocalDateTime.now());
        newResult.setUser(user);

        // save to database and return ResponseEntity of response
        EntityModel<Result> entityModel = assembler.toModel(repository.save(newResult));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    /**
     * return EntityModel<> - generic container that includes data and links
     *
     * @param id
     * @return
     */
    @GetMapping("/api/results/{id}")
    public EntityModel<Result> one(@PathVariable Long id) {

        Result result = repository.findById(id)
                .orElseThrow(() -> new resultPointNotFoundException(id));
        return assembler.toModel(result);

        // assembler does this job:

        // return EntityModel.of(result,
        // build a link to the one method of EmployeeController and flag it as a self link
        // linkTo(methodOn(ResultController.class).one(id)).withSelfRel(),
        // build a link to the aggregate root, all(), and call it "employees"
        // linkTo(methodOn(ResultController.class).all()).withRel("results")
        // );

        // HATEOAS core type Link is URI + relation
    }

    @PutMapping("/api/results/{id}")
    ResponseEntity<?> replaceResult(@RequestBody Result newResult, @PathVariable Long id) {

        Result updatedResult = repository.findById(id)
                .map(result -> {
                    result.setX(newResult.getX());
                    result.setY(newResult.getY());
                    result.setHit(newResult.getHit());
                    return repository.save(result);
                })
                .orElseGet(() -> {
                    return repository.save(newResult);
                });

        EntityModel<Result> entityModel = assembler.toModel(updatedResult);


        // Using the getRequiredLink() method, you can retrieve the Link created by the EmployeeModelAssembler with
        // a SELF rel. This method returns a Link, which must be turned into a URI with the toUri method
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    // clear all points
    @DeleteMapping("/api/results")
    public ResponseEntity<?> clear(@AuthenticationPrincipal User user) {
        List<Result> userResults = repository.findByUser(user);
        repository.deleteAll(userResults);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/results/{id}")
    ResponseEntity<?> deleteResultPoint(@AuthenticationPrincipal User user, @PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}