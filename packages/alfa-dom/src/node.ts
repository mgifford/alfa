import { Iterable } from "@siteimprove/alfa-iterable";
import { Mapper } from "@siteimprove/alfa-mapper";
import { None, Option } from "@siteimprove/alfa-option";
import { Predicate } from "@siteimprove/alfa-predicate";

const { join, find, filter, takeUntil, skip, skipUntil, reverse } = Iterable;
const { equals } = Predicate;

export abstract class Node implements Iterable<Node> {
  private readonly _children: Array<Node>;
  private _parent: Option<Node>;

  protected constructor(
    children: Mapper<Node, Iterable<Node>>,
    parent: Option<Node>
  ) {
    this._children = Array.from(children(this));
    this._parent = parent;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-tree-parent
   */
  public parent(_: Node.Traversal = {}): Option<Node> {
    return this._parent;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-tree-root
   */
  public root(options: Node.Traversal = {}): Node {
    for (const parent of this.parent(options)) {
      return parent.root(options);
    }

    return this;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-tree-child
   */
  public children(_: Node.Traversal = {}): Iterable<Node> {
    return this._children;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-tree-descendant
   */
  public *descendants(options: Node.Traversal = {}): Iterable<Node> {
    for (const child of this.children(options)) {
      yield child;
      yield* child.descendants(options);
    }
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-tree-ancestor
   */
  public *ancestors(options: Node.Traversal = {}): Iterable<Node> {
    for (const parent of this.parent(options)) {
      yield parent;
      yield* parent.ancestors(options);
    }
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-tree-previous-sibling
   */
  public previous<T extends Node>(
    predicate: Predicate<Node, T> = () => true,
    options: Node.Traversal = {}
  ): Option<T> {
    return this.parent(options).flatMap(parent =>
      find(
        reverse(takeUntil(parent.children(options), equals(this))),
        predicate
      )
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-tree-next-sibling
   */
  public next<T extends Node>(
    predicate: Predicate<Node, T> = () => true,
    options: Node.Traversal = {}
  ): Option<T> {
    return this.parent(options).flatMap(parent =>
      find(
        skip(skipUntil(parent.children(options), equals(this)), 1),
        predicate
      )
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-closest
   */
  public closest<T extends Node>(
    predicate: Predicate<Node, T>,
    options: Node.Traversal = {}
  ): Option<T> {
    return predicate(this)
      ? Option.of(this)
      : this.parent(options).flatMap(parent =>
          parent.closest(predicate, options)
        );
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-descendant-text-content
   */
  public textContent(options: Node.Traversal = {}): string {
    return join(filter(this.descendants(options), Text.isText), "");
  }

  public adopt(child: Node): Node {
    child._parent = Option.of(this);
    return child;
  }

  public *[Symbol.iterator](): Iterator<Node> {
    yield* this.descendants();
  }

  public abstract toJSON(): Node.JSON;
}

export namespace Node {
  export function isNode(value: unknown): value is Node {
    return value instanceof Node;
  }

  export interface Traversal {
    /**
     * When `true`, traverse the node in shadow-including tree order.
     *
     * @see https://dom.spec.whatwg.org/#concept-shadow-including-tree-order
     */
    readonly composed?: boolean;

    /**
     * When `true`, traverse the flattened element tree rooted at the node.
     *
     * @see https://drafts.csswg.org/css-scoping/#flat-tree
     */
    readonly flattened?: boolean;

    /**
     * When `true`, traverse all nested browsing contexts encountered.
     *
     * @see https://html.spec.whatwg.org/#nested-browsing-context
     */
    readonly nested?: boolean;
  }
}

import { Attribute } from "./node/attribute";
import { Comment } from "./node/comment";
import { Document } from "./node/document";
import { Element } from "./node/element";
import { Shadow } from "./node/shadow";
import { Text } from "./node/text";
import { Type } from "./node/type";

export namespace Node {
  export interface JSON {
    type: string;
  }

  export function fromNode(node: JSON, parent: Option<Node> = None): Node {
    switch (node.type) {
      case "element":
        return Element.fromElement(node as Element.JSON, parent);

      case "attribute":
        return Attribute.fromAttribute(
          node as Attribute.JSON,
          parent.filter(Element.isElement)
        );

      case "text":
        return Text.fromText(node as Text.JSON, parent);

      case "comment":
        return Comment.fromComment(node as Comment.JSON, parent);

      case "document":
        return Document.fromDocument(node as Document.JSON);

      case "type":
        return Type.fromType(node as Type.JSON, parent);

      case "shadow":
        return Shadow.fromShadow(
          node as Shadow.JSON,
          parent.filter(Element.isElement).get()
        );

      default:
        throw new Error(`Unexpected node of type: ${node.type}`);
    }
  }
}