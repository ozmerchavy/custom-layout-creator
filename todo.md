add slice named "draggedElement" 
with props: isDragged, type ('button'|'div'), mousePos,

add all css props to the form (and maybe style the form a bit)

add reducer: setChildrenToText(string)

in the form, if typeOfSelectedElemet is button,
    above cssprops form we need "text" field


add lightgray placeholder to cssprops inputs

export button


1. create component called PreviewCode
it will get the tree from redux, generate a string (html string),
and render it inside <pre><code> tags

