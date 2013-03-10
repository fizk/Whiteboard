<?php

return array(

	/**
	 * Controllers
	 */
	'controllers' => array(
		'invokables' => array(
			'Whiteboard\Controller\Index' => 'Whiteboard\Controller\IndexController',
		),
	),

	/**
	 * Routes
	 */
	'router' => array(
		'routes' => array(
			'default' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/whiteboard',
					'defaults' => array(
						'controller' => 'Whiteboard\Controller\Index',
						'action'     => 'index',
					),
				),
			), 
		),
	),

	'view_manager' => array(
		'template_path_stack' => array(
			'album' => __DIR__ . '/../view',
		),
		'strategies' => array(
			'ViewJsonStrategy',
		),
	),

);