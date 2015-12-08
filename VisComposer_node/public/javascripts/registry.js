/**
 * Created by huwanqi on 15-9-7.
 */
viscomposer.registry.array = {
    cartesian: viscomposer.workflow.Cartesian,
};

viscomposer.registry.primitive = {
    circle: viscomposer.workflow.Circle,
    view: viscomposer.workflow.View,
};

viscomposer.registry.func = {
    data: viscomposer.workflow.Data,
};

viscomposer.registry.form = {
    scatterplot: {
        array: 'coordinates',
        primitive: 'circle',
    },
};

viscomposer.registry.arrayUI = {
    cartesian: viscomposer.ui.CartesianUI,
};

viscomposer.registry.primitiveUI = {
    circle: viscomposer.ui.CircleUI,
    view: viscomposer.ui.ViewUI,
};

viscomposer.registry.funcUI = {
    data: viscomposer.ui.DataUI,
};

