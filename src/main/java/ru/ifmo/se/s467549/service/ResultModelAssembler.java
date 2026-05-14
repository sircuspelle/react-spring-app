package ru.ifmo.se.s467549.service;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import ru.ifmo.se.s467549.model.Result;
import ru.ifmo.se.s467549.network.ResultController;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;


// notation means that assembler will be automatically created with application start
@Component
/**
 define function that converst Result objects to EntityModel<Result> objects
 RepresentationModelAssembler does the work
 **/
public class ResultModelAssembler implements RepresentationModelAssembler<Result, EntityModel<Result>> {


    /**
     * converting a non-model object (Employee) into a model-based object (EntityModel<Employee>)
     * HATEOAS RepresentationModel can be replaced to EntityModel<T>
     * @param result
     * @return
     */
    @Override
    public EntityModel<Result> toModel(Result result) {

        return EntityModel.of(result,
                linkTo(methodOn(ResultController.class).one(result.getId())).withSelfRel(),
                // methodOn и linkTo это статические методы класса WebMvcLinkBuilder, который генерирует пути на основе
                // кода контроллера
                // Spring создает "фейковую" копию (прокси) контроллера, чтобы просто посмотреть
                // на аннотацию @GetMapping над этим методом и понять, какой URL ему соответствует
                // для передачи ссылки на /results конкретный пользователь не нужен, поэтому можно использовать затычку
                linkTo(methodOn(ResultController.class).all(null, 0, 0, null)).withRel("results"));
    }
}
